package edu.eci.arep.crud.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import edu.eci.arep.crud.model.Property;



@Repository
public interface PropertyRepository extends CrudRepository<Property, Long> {


}
