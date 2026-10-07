package com.portfolio.cms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@portfolio.com}")
    private String fromEmail;

    public void sendContactNotification(String name, String email, String subject, String messageContent) {
        if (mailSender == null) {
            System.out.println("[EmailService] JavaMailSender not configured. Logged message from " + email + ": " + messageContent);
            return;
        }
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromEmail);
            mailMessage.setTo(fromEmail);
            mailMessage.setSubject("New Portfolio Contact Form Message: " + subject);
            mailMessage.setText("From: " + name + " <" + email + ">\n\nSubject: " + subject + "\n\nMessage:\n" + messageContent);
            mailSender.send(mailMessage);
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }
}
