package com.pokework.repository;

import com.pokework.model.Pokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PokemonRepository extends JpaRepository<Pokemon, Long> {
    // Custom query to find by userId if needed, though relationships usually handle
    // this
}
