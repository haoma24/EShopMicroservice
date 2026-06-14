using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace BuildingBlocks.Behaviors
{
    public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger) : IPipelineBehavior<TRequest, TResponse>
        where TRequest : notnull, IRequest<TResponse>
        where TResponse : notnull
    {
        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            logger.LogInformation("[START] {RequestName}", typeof(TRequest).Name);

            var sw = Stopwatch.StartNew();
            var response = await next();
            sw.Stop();

            if (sw.Elapsed.TotalSeconds > 3)
                logger.LogWarning("[SLOW] {RequestName} took {ElapsedMs}ms", typeof(TRequest).Name, sw.ElapsedMilliseconds);

            logger.LogInformation("[END] {RequestName} completed in {ElapsedMs}ms", typeof(TRequest).Name, sw.ElapsedMilliseconds);

            return response;
        }
    }
}
