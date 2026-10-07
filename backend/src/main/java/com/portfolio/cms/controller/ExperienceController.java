package com.portfolio.cms.controller;

import com.portfolio.cms.model.Experience;
import com.portfolio.cms.repository.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experience")
@CrossOrigin(origins = "*")
public class ExperienceController {

    @Autowired
    private ExperienceRepository experienceRepository;

    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperience() {
        return ResponseEntity.ok(experienceRepository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping
    public ResponseEntity<Experience> createExperience(@RequestBody Experience experience) {
        return ResponseEntity.ok(experienceRepository.save(experience));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long id, @RequestBody Experience updated) {
        return experienceRepository.findById(id).map(existing -> {
            existing.setRole(updated.getRole());
            existing.setCompany(updated.getCompany());
            existing.setLocation(updated.getLocation());
            existing.setStartDate(updated.getStartDate());
            existing.setEndDate(updated.getEndDate());
            existing.setIsCurrent(updated.getIsCurrent());
            existing.setDescription(updated.getDescription());
            existing.setAchievements(updated.getAchievements());
            existing.setDisplayOrder(updated.getDisplayOrder());
            return ResponseEntity.ok(experienceRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        if (!experienceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        experienceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
