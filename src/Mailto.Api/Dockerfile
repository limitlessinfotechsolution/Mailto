# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy solution and restore
COPY Mailto.sln ./
COPY src/Mailto.Api/Mailto.Api.csproj src/Mailto.Api/
COPY src/Mailto.Core/Mailto.Core.csproj src/Mailto.Core/
COPY src/Mailto.Infrastructure/Mailto.Infrastructure.csproj src/Mailto.Infrastructure/
RUN dotnet restore src/Mailto.Api/Mailto.Api.csproj

# Copy all and publish
COPY . ./
RUN dotnet publish src/Mailto.Api/Mailto.Api.csproj -c Release -o out

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Mailto.Api.dll"]
