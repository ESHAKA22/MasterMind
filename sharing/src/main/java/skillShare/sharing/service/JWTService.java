package skillShare.sharing.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;

@Service
public class JWTService {
     @Value("${jwt.secret}")
    private String secret;

  @Value("${jwt.expiration}")
    private Long expiration;

    public String generateToken(String username) {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        SecretKeySpec signingKey = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(null, signingKey)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    private Claims extractClaims(String token) {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        SecretKeySpec signingKey = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());
        return Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
}