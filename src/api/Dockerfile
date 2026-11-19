FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore
COPY ["src/api/VnMurlSafeWeb.Api.csproj", "src/api/"]
RUN dotnet restore "src/api/VnMurlSafeWeb.Api.csproj"

# Copy source code and build
COPY src/api/ src/api/
WORKDIR "/src/src/api"
RUN dotnet publish "VnMurlSafeWeb.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080

COPY --from=build /app/publish .

# Copy research metrics and figures into container
COPY metrics/ /app/metrics/
COPY figures/ /app/figures/

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "VnMurlSafeWeb.Api.dll"]
