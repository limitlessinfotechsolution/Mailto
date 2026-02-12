# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy solution and restore
COPY Mailto.sln ./
COPY src/Mailto.Worker/Mailto.Worker.csproj src/Mailto.Worker/
COPY src/Mailto.Core/Mailto.Core.csproj src/Mailto.Core/
COPY src/Mailto.Infrastructure/Mailto.Infrastructure.csproj src/Mailto.Infrastructure/
RUN dotnet restore src/Mailto.Worker/Mailto.Worker.csproj

# Copy all and publish
COPY . ./
RUN dotnet publish src/Mailto.Worker/Mailto.Worker.csproj -c Release -o out

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "Mailto.Worker.dll"]
