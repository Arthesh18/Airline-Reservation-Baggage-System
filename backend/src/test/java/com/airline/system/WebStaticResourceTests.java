package com.airline.system;

import com.airline.system.config.WebMvcConfig;
import com.airline.system.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockServletConfig;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.support.GenericWebApplicationContext;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.servlet.resource.ResourceHttpRequestHandler;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class WebStaticResourceTests {

    private ResourceHttpRequestHandler resourceHandler;
    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() throws Exception {
        exceptionHandler = new GlobalExceptionHandler();

        MockServletContext servletContext = new MockServletContext();
        GenericWebApplicationContext appContext = new GenericWebApplicationContext(servletContext);
        appContext.refresh();

        resourceHandler = new ResourceHttpRequestHandler();
        resourceHandler.setLocations(Collections.singletonList(new ClassPathResource("static/")));
        resourceHandler.setApplicationContext(appContext);
        resourceHandler.setServletContext(servletContext);
        resourceHandler.afterPropertiesSet();
    }

    @Test
    void testIndexHtmlExistsAndContainsBrand() throws Exception {
        ClassPathResource indexResource = new ClassPathResource("static/index.html");
        assertTrue(indexResource.exists(), "index.html must exist in classpath:static/");

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/index.html");
        request.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, "/index.html");
        MockHttpServletResponse response = new MockHttpServletResponse();

        resourceHandler.handleRequest(request, response);

        assertEquals(200, response.getStatus());
        assertTrue(response.getContentAsString().contains("AIRTRACK"), "index.html must contain AIRTRACK brand");
    }

    @Test
    void testDashboardHtmlExistsAndContainsBrand() throws Exception {
        ClassPathResource dashboardResource = new ClassPathResource("static/dashboard.html");
        assertTrue(dashboardResource.exists(), "dashboard.html must exist in classpath:static/");

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/dashboard.html");
        request.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, "/dashboard.html");
        MockHttpServletResponse response = new MockHttpServletResponse();

        resourceHandler.handleRequest(request, response);

        assertEquals(200, response.getStatus());
        assertTrue(response.getContentAsString().contains("AirTrack"), "dashboard.html must contain AirTrack");
    }

    @Test
    void testCssAndJsAssetsExist() throws Exception {
        String[] assets = {
                "airport-home.css",
                "airport-home.js",
                "script.js",
                "style.css",
                "dashboard-router.js"
        };

        for (String asset : assets) {
            ClassPathResource res = new ClassPathResource("static/" + asset);
            assertTrue(res.exists(), asset + " must exist in classpath:static/");

            MockHttpServletRequest request = new MockHttpServletRequest("GET", "/" + asset);
            request.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, "/" + asset);
            MockHttpServletResponse response = new MockHttpServletResponse();

            resourceHandler.handleRequest(request, response);
            assertEquals(200, response.getStatus(), "Serving " + asset + " must return 200 OK");
            assertTrue(response.getContentAsString().length() > 0, asset + " content must not be empty");
        }
    }

    @Test
    void testNoResourceFoundExceptionReturns404() {
        NoResourceFoundException ex = new NoResourceFoundException(
                org.springframework.http.HttpMethod.GET,
                "missing-file.xyz",
                "No static resource for request 'missing-file.xyz'"
        );

        var responseEntity = exceptionHandler.handleNoResourceFound(ex);

        assertNotNull(responseEntity);
        assertEquals(404, responseEntity.getStatusCode().value());
        assertNotNull(responseEntity.getBody());
        assertEquals("Not Found", responseEntity.getBody().getError());
    }
}
