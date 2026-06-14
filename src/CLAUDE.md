# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

SDK version is pinned to **10.0.104** in `global.json`.

```bash
# Build entire solution
dotnet build

# Run the Catalog API (HTTP :5000 / HTTPS :5050) — requires catalogdb running
docker-compose up catalogdb -d
dotnet run --project Services/Catalog/Catalog.API

# Run the Basket API (HTTP :5001 / HTTPS :5151) — requires basketdb + Redis
docker-compose up basketdb distributedcache -d
dotnet run --project Services/Basket/Basket.API

# Start all services via Docker
docker-compose up
```

There are no test projects currently in this solution.

Health check endpoints: `GET /health` on each service (returns HealthChecks.UI JSON).

## Architecture

This is a **.NET 10** microservices solution using **vertical slice / feature-folder** organization. Each feature owns all of its layers — endpoint, CQRS object, handler, mapper profile — in a single folder.

### Shared abstractions — `BuildingBlocks/`

Thin wrappers over MediatR that enforce CQRS naming conventions:

| Type | Extends |
|------|---------|
| `ICommand<TResponse>` | `IRequest<TResponse>` |
| `ICommand` | `ICommand<Unit>` |
| `ICommandHandler<TCommand, TResponse>` | `IRequestHandler<TCommand, TResponse>` |
| `IQuery<TResponse>` | `IRequest<TResponse>` |
| `IQueryHandler<TQuery, TResponse>` | `IRequestHandler<TQuery, TResponse>` |

**Pipeline behaviors** (registered automatically):
- `ValidationBehavior<TRequest, TResponse>` — runs all `IValidator<TRequest>` instances before the handler; throws `ValidationException` on failure.
- `LoggingBehavior<TRequest, TResponse>` — logs request start/end; warns when a handler takes >3 seconds.

**Exception handling** — `CustomExceptionHandler` maps domain exceptions to HTTP problem details:

| Exception | HTTP Status |
|-----------|-------------|
| `NotFoundException` | 404 |
| `ValidationException` | 400 |
| `BadRequestException` | 400 |
| `InternalServerException` | 500 |

All responses include `traceId` from the current `Activity`.

### Catalog service — `Services/Catalog/Catalog.API/`

**Stack:** Carter · MediatR · Marten (PostgreSQL document DB, lightweight sessions) · AutoMapper · FluentValidation

**Global usings** are declared in `GlobalUsing.cs` — `Carter`, `AutoMapper`, `MediatR`, `BuildingBlocks.CQRS`, `Catalog.API.Models`, and `Marten` are available everywhere without explicit usings.

**Feature folder layout** (`Products/<FeatureName>/`):
- `*Endpoint.cs` — `ICarterModule`, maps HTTP route → CQRS dispatch. Always use `[FromServices]` for `ISender` and `IMapper` parameters in lambda handlers.
- `*Handler.cs` — `ICommandHandler` or `IQueryHandler`, contains business logic and direct `IDocumentSession` access. Inline `AbstractValidator<TCommand>` lives here.
- `*Command.cs` / `*Query.cs` — record types that carry the intent.
- `*Profile.cs` — AutoMapper profile for Request→Command and Result→Response mapping.

**Database:** Marten wraps PostgreSQL as a document store. `IDocumentSession` is injected directly into handlers (no repository layer). Always set `Id = Guid.NewGuid()` explicitly when creating new documents. MediatR and AutoMapper are both registered against `typeof(Program).Assembly`.

**Connection string key:** `"Database"` (in `appsettings.json` → `ConnectionStrings`).

### Basket service — `Services/Basket/Basket.API/`

**Stack:** Carter · MediatR · Marten (PostgreSQL) · Redis (distributed cache) · Scrutor (decorator registration)

**Feature folder layout** (`Basket/<FeatureName>/`) — same pattern as Catalog: Endpoint + Handler + Command/Query. No AutoMapper profiles; handlers work directly with the repository.

**Repository pattern with caching decorator:**
- `IBasketRepository` — interface for shopping cart persistence.
- `BasketRepository` — concrete implementation wrapping Marten `IDocumentSession`.
- `CachedBasketRepository` — decorator registered via Scrutor that adds a Redis cache layer in front of `BasketRepository`.

```csharp
// Scrutor decorator registration in Program.cs
builder.Services.AddScoped<IBasketRepository, BasketRepository>();
builder.Services.Decorate<IBasketRepository, CachedBasketRepository>();
```

`ShoppingCart` identity is `UserName` (string), not a GUID. Health checks cover both PostgreSQL and Redis.

### Discount service — `Services/Discount.Grpc/`

Skeleton gRPC service running on **.NET 8** (intentionally different SDK). Proto file: `Protos/greet.proto`. Not yet wired into docker-compose or consumed by other services.

### Adding a new feature (Catalog pattern)

1. Create a folder `Products/<FeatureName>/`
2. Add record `*Command` or `*Query` implementing `ICommand<TResult>` or `IQuery<TResult>`
3. Add `internal class *Handler` implementing the matching handler interface; inject `IDocumentSession` via primary constructor; include an inline `AbstractValidator<TCommand>` if validation is needed
4. Add `*Profile : Profile` with `CreateMap<>` calls
5. Add `*Endpoint : ICarterModule` and implement `AddRoutes`; use `[FromServices]` on `ISender`/`IMapper` lambda parameters

### Adding a new microservice

Mirror the Catalog or Basket structure: reference `BuildingBlocks`, register Carter + MediatR + Marten (or another store) in `Program.cs`, add a service entry in `docker-compose.yml` and `docker-compose.override.yml`.
