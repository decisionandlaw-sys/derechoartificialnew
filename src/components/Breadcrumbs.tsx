
export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) { 
   const schema = { 
     "@context": "https://schema.org", 
     "@type": "BreadcrumbList", 
     itemListElement: items.map((item, index) => ({ 
       "@type": "ListItem", 
       position: index + 1, 
       name: item.label, 
       item: `https://www.derechoartificial.com${item.href}`, 
     })), 
   }; 
  
   return ( 
     <> 
       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /> 
       <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600"> 
         <ol className="flex flex-wrap gap-2"> 
           {items.map((item, index) => ( 
             <li key={item.href} className="flex items-center"> 
               {index > 0 && <span className="mx-2">/</span>} 
               {index === items.length - 1 ? ( 
                 <span>{item.label}</span> 
               ) : ( 
                 <a href={item.href} className="hover:underline text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">{item.label}</a> 
               )} 
             </li> 
           ))} 
         </ol> 
       </nav> 
     </> 
   ); 
 } 
