# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy solution and restore
COPY Mailto.sln ./
COPY src/Mailto.UI/Mailto.UI.csproj src/Mailto.UI/
COPY src/Mailto.Core/Mailto.Core.csproj src/Mailto.Core/
RUN dotnet restore src/Mailto.UI/Mailto.UI.csproj

# Copy all and publish
COPY . ./
RUN dotnet publish src/Mailto.UI/Mailto.UI.csproj -c Release -o out

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Mailto.UI.dll"]
