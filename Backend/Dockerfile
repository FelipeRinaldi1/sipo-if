FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Template.csproj","./"]
RUN dotnet restore "Template.csproj"

COPY . .
RUN dotnet build "Template.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Template.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS FINAL
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT [ "dotnet","Template.dll" ]

