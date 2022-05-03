import axios from "axios";

export interface NameApiServiceInterface {
  getFirstName(): Promise<string>
}

export class NameApiService implements NameApiServiceInterface {
  private MAX_LENGTH = 4;

  async getFirstName(): Promise<string> {
    const { data } = await axios.get(
      "https://random-data-api.com/api/name/random_name"
    );
    const firstName = data.first_name as string;

    if (firstName.length > this.MAX_LENGTH) {
      throw new Error("firstName is too long!");
    }

    return firstName;
  }
}
