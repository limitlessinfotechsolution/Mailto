param (
    [Parameter(Mandatory=$true)]
    [string]$CompanyName,
    [Parameter(Mandatory=$true)]
    [string]$Domain
)

Write-Host "Creating tenant: $CompanyName with domain $Domain..."
# Logic to call API or DB would go here
Write-Host "Tenant created successfully."
