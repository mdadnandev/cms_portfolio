package com.portfolio.cms.repository;

import com.portfolio.cms.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findAllByOrderByCreatedAtDesc();
}
