using Mailto.Worker.Workers;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<SmtpListener>();
builder.Services.AddHostedService<ImapSyncWorker>();

var host = builder.Build();
host.Run();
