package com.portfolio.cms.config;

import com.portfolio.cms.model.*;
import com.portfolio.cms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AboutRepository aboutRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final BlogRepository blogRepository;
    private final ExperienceRepository experienceRepository;
    private final TestimonialRepository testimonialRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            AboutRepository aboutRepository,
            SkillRepository skillRepository,
            ProjectRepository projectRepository,
            BlogRepository blogRepository,
            ExperienceRepository experienceRepository,
            TestimonialRepository testimonialRepository,
            ServiceRepository serviceRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.aboutRepository = aboutRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.blogRepository = blogRepository;
        this.experienceRepository = experienceRepository;
        this.testimonialRepository = testimonialRepository;
        this.serviceRepository = serviceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Admin User
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", "admin@portfolio.com", passwordEncoder.encode("admin123"), "ROLE_ADMIN");
            userRepository.save(admin);
            System.out.println("Default Admin User created: username=admin, password=admin123");
        }

        // 2. Seed About Details
        if (aboutRepository.count() == 0) {
            About about = new About();
            about.setFullName("Adnan");
            about.setTitle("Lead Full-Stack Architect & Senior Engineer");
            about.setSubtitle("Building enterprise Java Spring Boot backends & ultra-performant React/Next.js dynamic web architectures");
            about.setBio("Passionate software engineer with over 6 years of expertise crafting scalable microservices, custom headless CMS platforms, and high-performance frontend interfaces. Specialist in Spring Boot, PostgreSQL, Next.js, and Cloud Infrastructure.");
            about.setExperienceYears(6);
            about.setCompletedProjects(42);
            about.setHappyClients(28);
            about.setLocation("San Francisco, CA / Remote");
            about.setPrimaryEmail("adnan.developer@example.com");
            about.setGithubUrl("https://github.com");
            about.setLinkedinUrl("https://linkedin.com");
            about.setTwitterUrl("https://twitter.com");
            about.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop");
            about.setResumeUrl("/resume.pdf");
            aboutRepository.save(about);
        }

        // 3. Seed Skills
        if (skillRepository.count() == 0) {
            createSkill("Java & Spring Boot", "Backend", 96, "Server", 1);
            createSkill("React & Next.js", "Frontend", 94, "Layout", 2);
            createSkill("PostgreSQL & Supabase", "Database", 90, "Database", 3);
            createSkill("Tailwind CSS & Design Systems", "Frontend", 95, "Palette", 4);
            createSkill("RESTful API Architecture", "Backend", 98, "Network", 5);
            createSkill("Docker & Cloud Deployments", "DevOps", 88, "Cloud", 6);
        }

        // 4. Seed Services
        if (serviceRepository.count() == 0) {
            createService("Custom CMS & Engine Development", "Custom-built headless CMS backends tailored with granular access control, high throughput, and zero vendor lock-in.", "Cpu", "Custom Schemas, REST/GraphQL APIs, Admin Controls, High Speed", 1);
            createService("Full-Stack Web Development", "End-to-end web apps crafted with Next.js, React, and Java Spring Boot for unmatched speed and security.", "Code2", "SEO Optimization, Glassmorphic UI, Mobile-first Responsive, Micro-interactions", 2);
            createService("Database Engineering & Cloud Infrastructure", "Architecting high-availability PostgreSQL/Supabase databases with automated migrations and Cloudinary CDN storage.", "Database", "Relational Modeling, Indexing, Cloud Integration, Zero Downtime", 3);
        }

        // 5. Seed Projects
        if (projectRepository.count() == 0) {
            createProject("Custom Enterprise Portfolio & Headless CMS", "Full-stack headless CMS engine built with Java Spring Boot, JWT Security, and PostgreSQL paired with a Next.js Executive Portfolio.", "Full-Stack & CMS", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop", "https://example.com", "https://github.com", "Java, Spring Boot, React, Next.js, PostgreSQL, Tailwind", true, 1);
            createProject("FinTech Wealth Analytics Dashboard", "Real-time cryptocurrency and stocks analytical platform with interactive charting and automated ledger feeds.", "Web App", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop", "https://example.com", "https://github.com", "React, Tailwind, Node.js, WebSockets, Chart.js", true, 2);
            createProject("Cloudinary-Powered Asset Engine", "Automated asset optimization microservice for fast media streaming, transformations, and global CDN distribution.", "Cloud & API", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop", "https://example.com", "https://github.com", "Spring Boot, Cloudinary API, Docker, PostgreSQL", false, 3);
        }

        // 6. Seed Experience
        if (experienceRepository.count() == 0) {
            createExperience("Principal Software Architect", "Apex Tech Solutions", "San Francisco, CA", "2023", "Present", true, "Architecting Java Spring Boot backends and modern React micro-frontends serving over 1M active users.", "Engineered modular CMS backend reducing content delivery latency by 45%.", 1);
            createExperience("Senior Full-Stack Engineer", "Nexus Global Innovations", "Remote", "2021", "2023", false, "Designed distributed REST services and PostgreSQL schemas for enterprise SaaS products.", "Led team of 6 engineers; delivered zero-downtime DB migrations.", 2);
        }

        // 7. Seed Testimonials
        if (testimonialRepository.count() == 0) {
            createTestimonial("Elena Rostova", "VP of Product", "Vanguard Digital", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop", "Adnan delivered our custom CMS platform ahead of schedule with flawless architecture. His attention to design detail is unmatched.", 5);
            createTestimonial("Marcus Vance", "CTO", "Aether Labs", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop", "The Spring Boot API performance paired with the sleek Next.js UI exceeded all our expectations.", 5);
        }

        // 8. Seed Blogs
        if (blogRepository.count() == 0) {
            createBlog("Building a Custom Headless CMS from Scratch with Java Spring Boot", "building-custom-cms-spring-boot", "Learn how to build a lightweight, ultra-secure CMS backend without relying on third-party SaaS dependencies.", "In this deep dive, we explore how to construct a robust Java 21 Spring Boot REST API backed by PostgreSQL, JWT authentication, and Cloudinary image uploads.", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop", "Adnan", "6 min read", "Java, Spring Boot, CMS, Backend");
            createBlog("Designing Executive Dark-Theme UIs with Gold Halos & Tailwind CSS", "executive-dark-theme-ui-tailwind", "Mastering modern executive portfolio aesthetic with frosted glassmorphism and ambient glow effects.", "Visual elegance is key for senior developer portfolios. Here is how we implemented gold/amber halo lighting and high-contrast typography.", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop", "Adnan", "4 min read", "React, Tailwind CSS, UI/UX, Design");
        }
    }

    private void createSkill(String name, String category, int proficiency, String icon, int order) {
        Skill s = new Skill();
        s.setName(name);
        s.setCategory(category);
        s.setProficiency(proficiency);
        s.setIconName(icon);
        s.setDisplayOrder(order);
        skillRepository.save(s);
    }

    private void createService(String title, String description, String icon, String features, int order) {
        Service s = new Service();
        s.setTitle(title);
        s.setDescription(description);
        s.setIconName(icon);
        s.setFeatures(features);
        s.setDisplayOrder(order);
        serviceRepository.save(s);
    }

    private void createProject(String title, String desc, String category, String img, String demo, String github, String tags, boolean featured, int order) {
        Project p = new Project();
        p.setTitle(title);
        p.setDescription(desc);
        p.setLongDescription(desc + " Built with clean modular architecture and optimized for speed.");
        p.setCategory(category);
        p.setImageUrl(img);
        p.setDemoUrl(demo);
        p.setGithubUrl(github);
        p.setTags(tags);
        p.setFeatured(featured);
        p.setDisplayOrder(order);
        projectRepository.save(p);
    }

    private void createExperience(String role, String company, String location, String start, String end, boolean current, String desc, String achievements, int order) {
        Experience e = new Experience();
        e.setRole(role);
        e.setCompany(company);
        e.setLocation(location);
        e.setStartDate(start);
        e.setEndDate(end);
        e.setIsCurrent(current);
        e.setDescription(desc);
        e.setAchievements(achievements);
        e.setDisplayOrder(order);
        experienceRepository.save(e);
    }

    private void createTestimonial(String name, String role, String company, String avatar, String quote, int rating) {
        Testimonial t = new Testimonial();
        t.setClientName(name);
        t.setClientRole(role);
        t.setCompany(company);
        t.setAvatarUrl(avatar);
        t.setQuote(quote);
        t.setRating(rating);
        testimonialRepository.save(t);
    }

    private void createBlog(String title, String slug, String summary, String content, String img, String author, String readTime, String tags) {
        Blog b = new Blog();
        b.setTitle(title);
        b.setSlug(slug);
        b.setSummary(summary);
        b.setContent(content);
        b.setCoverImage(img);
        b.setAuthor(author);
        b.setReadTime(readTime);
        b.setTags(tags);
        b.setPublished(true);
        b.setCreatedAt(LocalDateTime.now());
        blogRepository.save(b);
    }
}
