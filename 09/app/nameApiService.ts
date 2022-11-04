import axios from "axios";

export interface NameApiServiceInterface {
  getFirstName(): Promise<string>
}

export class NameApiService implements NameApiServiceInterface {
  private readonly MAX_LENGTH = 4;

  async getFirstName(): Promise<string> {
    const { data: { firstName } }: { data: { firstName: string } } = await axios.get(
      "https://random-data-api.com/api/name/random_name"
    );
    if (firstName.length > this.MAX_LENGTH) {
      throw new Error("firstName is too long!");
    }
    return firstName;
  }
}
