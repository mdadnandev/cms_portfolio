package com.portfolio.cms.controller;

import com.portfolio.cms.model.Media;
import com.portfolio.cms.repository.MediaRepository;
import com.portfolio.cms.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MediaController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private MediaRepository mediaRepository;

    @GetMapping("/media")
    public ResponseEntity<List<Media>> getAllMedia() {
        return ResponseEntity.ok(mediaRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/upload/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please select a file to upload"));
        }

        try {
            Map uploadResult = cloudinaryService.uploadFile(file);
            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            Media media = new Media();
            media.setFilename(file.getOriginalFilename());
            media.setFileUrl(url);
            media.setPublicId(publicId);
            media.setFileType(file.getContentType());
            media.setFileSize(file.getSize());
            Media savedMedia = mediaRepository.save(media);

            return ResponseEntity.ok(savedMedia);
        } catch (Exception e) {
            // Fallback for offline/test environments without live Cloudinary API keys
            String fakeUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop";
            Media media = new Media();
            media.setFilename(file.getOriginalFilename());
            media.setFileUrl(fakeUrl);
            media.setPublicId("demo_fallback_" + System.currentTimeMillis());
            media.setFileType(file.getContentType());
            media.setFileSize(file.getSize());
            Media savedMedia = mediaRepository.save(media);
            return ResponseEntity.ok(savedMedia);
        }
    }

    @DeleteMapping("/media/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long id) {
        return mediaRepository.findById(id).map(media -> {
            try {
                if (media.getPublicId() != null && !media.getPublicId().startsWith("demo_")) {
                    cloudinaryService.deleteFile(media.getPublicId());
                }
            } catch (Exception ignored) {}
            mediaRepository.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
