FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-buster AS build
WORKDIR /src
COPY ["SpeechApp.API/SpeechApp.API.csproj", "SpeechApp.API/"]
RUN dotnet restore "SpeechApp.API/SpeechApp.API.csproj"
COPY . .
WORKDIR "/src/SpeechApp.API"
RUN dotnet build "SpeechApp.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SpeechApp.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SpeechApp.API.dll"]
