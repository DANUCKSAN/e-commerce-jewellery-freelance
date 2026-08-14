import { Account, Client } from "appwrite";

type AppwriteServices = {
  account: Account;
  client: Client;
};

let services: AppwriteServices | null = null;

export class AppwriteConfigurationError extends Error {
  constructor() {
    super(
      "Appwrite authentication is not configured. Add the public endpoint and project ID to your environment.",
    );
    this.name = "AppwriteConfigurationError";
  }
}

function readConfiguration() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.trim();
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID?.trim();

  if (!endpoint || !projectId) {
    throw new AppwriteConfigurationError();
  }

  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new AppwriteConfigurationError();
    }
  } catch (error) {
    if (error instanceof AppwriteConfigurationError) throw error;
    throw new AppwriteConfigurationError();
  }

  return { endpoint, projectId };
}

export function getAppwriteServices(): AppwriteServices {
  if (services) return services;

  const { endpoint, projectId } = readConfiguration();
  const client = new Client().setEndpoint(endpoint).setProject(projectId);

  services = {
    account: new Account(client),
    client,
  };

  return services;
}
