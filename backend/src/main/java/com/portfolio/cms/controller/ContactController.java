package com.portfolio.cms.controller;

import com.portfolio.cms.model.ContactMessage;
import com.portfolio.cms.repository.ContactMessageRepository;
import com.portfolio.cms.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> submitContactForm(@RequestBody ContactMessage contactMessage) {
        if (contactMessage.getEmail() == null || contactMessage.getMessage() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and message are required."));
        }

        ContactMessage saved = contactMessageRepository.save(contactMessage);

        // Dispatch background email notification
        emailService.sendContactNotification(
                saved.getName(),
                saved.getEmail(),
                saved.getSubject(),
                saved.getMessage()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Thank you! Your message has been sent successfully.",
                "id", saved.getId()
        ));
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactMessageRepository.findAllByOrderByCreatedAtDesc());
    }

    @PutMapping("/messages/{id}/read")
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable Long id) {
        return contactMessageRepository.findById(id).map(msg -> {
            msg.setIsRead(true);
            return ResponseEntity.ok(contactMessageRepository.save(msg));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        if (!contactMessageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contactMessageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
