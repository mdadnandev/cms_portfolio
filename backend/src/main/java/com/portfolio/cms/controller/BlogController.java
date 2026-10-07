package com.portfolio.cms.controller;

import com.portfolio.cms.model.Blog;
import com.portfolio.cms.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*")
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs() {
        return ResponseEntity.ok(blogRepository.findByPublishedTrueOrderByCreatedAtDesc());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Blog>> getAdminAllBlogs() {
        return ResponseEntity.ok(blogRepository.findAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Blog> getBlogBySlug(@PathVariable String slug) {
        return blogRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Blog> createBlog(@RequestBody Blog blog) {
        if (blog.getSlug() == null || blog.getSlug().isEmpty()) {
            blog.setSlug(blog.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return ResponseEntity.ok(blogRepository.save(blog));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable Long id, @RequestBody Blog updated) {
        return blogRepository.findById(id).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setSlug(updated.getSlug());
            existing.setSummary(updated.getSummary());
            existing.setContent(updated.getContent());
            existing.setCoverImage(updated.getCoverImage());
            existing.setAuthor(updated.getAuthor());
            existing.setReadTime(updated.getReadTime());
            existing.setTags(updated.getTags());
            existing.setPublished(updated.getPublished());
            return ResponseEntity.ok(blogRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        if (!blogRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        blogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
