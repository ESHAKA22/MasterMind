import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';

function SearchBar({ onSearch, style }) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <Form onSubmit={handleSubmit} style={style}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
          variant="primary" 
          type="submit"
        >
          <BsSearch />
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchBar;