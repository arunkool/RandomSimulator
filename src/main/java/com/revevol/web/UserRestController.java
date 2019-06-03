package com.revevol.web;

import java.security.Principal;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rest controller for getting logged user details
 */
@RestController
public class UserRestController {
	@RequestMapping("/user")
	public Principal getUserDetail(Principal principal) {
		return principal;
	}

}
