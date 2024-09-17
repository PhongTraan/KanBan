package com.api.service;

import com.api.dto.UserDto;
import com.api.entity.User;
import com.api.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class UsersManagementService {
    @Autowired
    private UserRepo usersRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDto register(UserDto registrationRequest){

        UserDto resp = new UserDto();

        try {
            if (usersRepo.findByEmail(registrationRequest.getEmail()).isPresent()) {
                resp.setStatusCode(400);
                resp.setError("Email already exists");
                return resp;
            }

            User user = new User();
            user.setEmail(registrationRequest.getEmail());
            user.setRole(registrationRequest.getRole());
            user.setName(registrationRequest.getName());
            user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            User ourUsersResult = usersRepo.save(user);
            if (ourUsersResult.getId()>0) {
                resp.setOurUsers((ourUsersResult));
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
            }


        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public UserDto login(UserDto loginRequest) {
        UserDto response = new UserDto();
        try {
            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");
        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return  response;
    }

//    public ReqRes login(ReqRes loginRequest){
//        ReqRes response = new ReqRes();
//        try {
//            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
//            var jwt = jwtUtils.generateToken(user);
//            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
//            response.setStatusCode(200);
//            response.setToken(jwt);
//            response.setRole(user.getRole());
//            response.setRefreshToken(refreshToken);
//            response.setExpirationTime("24Hrs");
//            response.setMessage("Successfully Logged In");
//        }catch (Exception e){
//            response.setStatusCode(500);
//            response.setMessage(e.getMessage());
//        }
//        return response;
//    }
//
//
//    public ReqRes refreshToken(ReqRes refreshTokenReqiest){
//        ReqRes response = new ReqRes();
//        try{
//            String ourEmail = jwtUtils.extractUsername(refreshTokenReqiest.getToken());
//            OurUser users = usersRepo.findByEmail(ourEmail).orElseThrow();
//            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(), users)) {
//                var jwt = jwtUtils.generateToken(users);
//                response.setStatusCode(200);
//                response.setToken(jwt);
//                response.setRefreshToken(refreshTokenReqiest.getToken());
//                response.setExpirationTime("24Hr");
//                response.setMessage("Successfully Refreshed Token");
//            }
//            response.setStatusCode(200);
//            return response;
//
//        }catch (Exception e){
//            response.setStatusCode(500);
//            response.setMessage(e.getMessage());
//            return response;
//        }
//    }
}
