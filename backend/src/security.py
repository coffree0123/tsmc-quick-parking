'''Security module using JWT'''
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from jose import jwt
from jose.exceptions import JOSEError

TENANT_ID = "0caea1cb-f419-4010-afc6-cb055deaf201"
CLIENT_ID = "445f1017-2318-4b79-a470-9164afe1738b"

class JWTBearer(HTTPBearer):
    '''JWT bearer'''
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme")
            token_claims = await self.verify_jwt(credentials.credentials)
            if not token_claims:
                raise HTTPException(status_code=403, detail="Invalid token or expired token")
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code")
        request.state.token_claims = token_claims

    async def verify_jwt(self, token: str) -> bool:
        '''Verify and decode JWT'''
        try:
            unverified_header = jwt.get_unverified_header(token)
            jwks_url = f'https://login.microsoftonline.com/{TENANT_ID}/discovery/v2.0/keys'
            async with httpx.AsyncClient() as client:
                resp = await client.get(jwks_url)
                if resp.status_code != 200:
                    raise HTTPException(
                        status_code=404,
                        detail="Problem with Azure AD discovery URL"
                    )

            jwks = resp.json()
            rsa_key = {}
            for key in jwks["keys"]:
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }
            token_claims = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=CLIENT_ID,
                issuer=f'https://login.microsoftonline.com/{TENANT_ID}/v2.0'
            )
        except JOSEError:
            token_claims = None

        return token_claims

authentication = JWTBearer()

def get_user_id(request: Request) -> str:
    '''Get user_id from token claims in request.state'''
    return request.state.token_claims['sub']

def is_guard(request: Request) -> bool:
    '''Check if the person is guard from token claims in request.state'''
    return request.state.token_claims.get('roles', None) is not None
