using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace Mailto.Worker.Workers
{
    public class SmtpListener : BackgroundService
    {
        private readonly ILogger<SmtpListener> _logger;

        public SmtpListener(ILogger<SmtpListener> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SMTP Listener starting...");
            while (!stoppingToken.IsCancellationRequested)
            {
                // Logic to listen for incoming SMTP connections
                await Task.Delay(10000, stoppingToken);
            }
        }
    }
}
