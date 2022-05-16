package com.hcl.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.Year;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "album")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "genre_id", nullable = false)
    private ProductCategory genre;

    @Column(name = "sku")
    private String sku;

    @Column(name = "name")
    private String name;


    @Column(name = "artist_name")
    private String artistName;

    @Column(name = "description")
    private String description;

    @Column(name = "tracks")
    private int tracks;

    @Convert(
            converter = YearAttributeConverter.class
    )
    @Column(name = "year_published")
    private Year yearPublished;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "active")
    private boolean active;

    @Column(name = "units_in_stock")
    private int unitsInStock;

    @Column(name = "date_created")
    @CreationTimestamp
    private Date dateCreated;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private Date lastUpdated;
}
