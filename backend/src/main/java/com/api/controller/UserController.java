package com.api.controller;

import com.api.dto.UserDto;
import com.api.service.UsersManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class UserController {
    @Autowired
    UsersManagementService usersManagementService;
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody UserDto userDto) {
        return  ResponseEntity.ok(usersManagementService.register(userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody UserDto userDto) {
        return  ResponseEntity.ok(usersManagementService.login(userDto));
    }

}
