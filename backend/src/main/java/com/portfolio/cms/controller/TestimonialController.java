package com.portfolio.cms.controller;

import com.portfolio.cms.model.Testimonial;
import com.portfolio.cms.repository.TestimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
@CrossOrigin(origins = "*")
public class TestimonialController {

    @Autowired
    private TestimonialRepository testimonialRepository;

    @GetMapping
    public ResponseEntity<List<Testimonial>> getAllTestimonials() {
        return ResponseEntity.ok(testimonialRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(testimonialRepository.save(testimonial));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Testimonial> updateTestimonial(@PathVariable Long id, @RequestBody Testimonial updated) {
        return testimonialRepository.findById(id).map(existing -> {
            existing.setClientName(updated.getClientName());
            existing.setClientRole(updated.getClientRole());
            existing.setCompany(updated.getCompany());
            existing.setAvatarUrl(updated.getAvatarUrl());
            existing.setQuote(updated.getQuote());
            existing.setRating(updated.getRating());
            return ResponseEntity.ok(testimonialRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Long id) {
        if (!testimonialRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        testimonialRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
