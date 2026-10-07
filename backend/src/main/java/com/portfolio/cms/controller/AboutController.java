package com.portfolio.cms.controller;

import com.portfolio.cms.model.About;
import com.portfolio.cms.repository.AboutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/about")
@CrossOrigin(origins = "*")
public class AboutController {

    @Autowired
    private AboutRepository aboutRepository;

    @GetMapping
    public ResponseEntity<About> getAbout() {
        List<About> list = aboutRepository.findAll();
        if (list.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list.get(0));
    }

    @PostMapping
    public ResponseEntity<About> createAbout(@RequestBody About about) {
        About saved = aboutRepository.save(about);
        return ResponseEntity.ok(saved);
    }

    @PutMapping
    public ResponseEntity<About> updateAbout(@RequestBody About updated) {
        List<About> list = aboutRepository.findAll();
        if (list.isEmpty()) {
            return ResponseEntity.ok(aboutRepository.save(updated));
        }
        About existing = list.get(0);
        existing.setFullName(updated.getFullName());
        existing.setTitle(updated.getTitle());
        existing.setSubtitle(updated.getSubtitle());
        existing.setBio(updated.getBio());
        existing.setExperienceYears(updated.getExperienceYears());
        existing.setCompletedProjects(updated.getCompletedProjects());
        existing.setHappyClients(updated.getHappyClients());
        existing.setAvatarUrl(updated.getAvatarUrl());
        existing.setResumeUrl(updated.getResumeUrl());
        existing.setLocation(updated.getLocation());
        existing.setPrimaryEmail(updated.getPrimaryEmail());
        existing.setGithubUrl(updated.getGithubUrl());
        existing.setLinkedinUrl(updated.getLinkedinUrl());
        existing.setTwitterUrl(updated.getTwitterUrl());

        return ResponseEntity.ok(aboutRepository.save(existing));
    }
}
