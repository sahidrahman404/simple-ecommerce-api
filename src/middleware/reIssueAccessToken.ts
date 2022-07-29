import { get } from "lodash";
import config from "config";
import { UserRepo } from "../repos/user-repo";
import { signJwt, verifyJwt } from "../utils/jwt.utils";

const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "id")) return false;

  const session = await UserRepo.findSessionsById(get(decoded, "id"));

  if (!session || !session.valid) return false;

  if (session.valid) {
    // create an access token
    const accessToken = signJwt(
      {
        ...session,
      },
      { expiresIn: config.get<string>("accessTokenTtl") } // 1 minutes
    );

    return accessToken;
  } else {
    return false;
  }
};

export default reIssueAccessToken;
