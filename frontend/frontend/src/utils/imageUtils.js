/**
 * Get appropriate image URL based on course category
 * @param {string} category - Course category
 * @returns {string} Image URL
 */
export const getCourseImage = (category) => {
  // Normalize category to lowercase for case-insensitive matching
  const cat = (category || '').toLowerCase();
  
  // Programming languages
  if (cat.includes('java')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original-wordmark.svg';
  } else if (cat.includes('python')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg';
  } else if (cat.includes('javascript') || cat.includes('js')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg';
  } else if (cat.includes('react')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg';
  } else if (cat.includes('angular')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg';
  } else if (cat.includes('vue')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original-wordmark.svg';
  } else if (cat.includes('node')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg';
  } else if (cat.includes('c#') || cat.includes('csharp') || cat.includes('dotnet')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg';
  } else if (cat.includes('c++') || cat.includes('cpp')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg';
  } else if (cat.includes('php')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg';
  }
  
  // General categories
  else if (cat.includes('programming') || cat.includes('coding')) {
    return 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  } else if (cat.includes('web') || cat.includes('frontend')) {
    return 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  } else if (cat.includes('database') || cat.includes('sql')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg';
  } else if (cat.includes('design')) {
    return 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  } else if (cat.includes('business')) {
    return 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  } else if (cat.includes('ai') || cat.includes('machine') || cat.includes('data science')) {
    return 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  }
  
  // Default image for other categories
  return 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
};