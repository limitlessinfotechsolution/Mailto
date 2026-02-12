using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace Mailto.Worker.Workers
{
    public class ImapSyncWorker : BackgroundService
    {
        private readonly ILogger<ImapSyncWorker> _logger;

        public ImapSyncWorker(ILogger<ImapSyncWorker> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("IMAP Sync Worker starting...");
            while (!stoppingToken.IsCancellationRequested)
            {
                // Logic to sync with external IMAP servers if needed
                await Task.Delay(30000, stoppingToken);
            }
        }
    }
}
