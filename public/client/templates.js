window.Templates = {};
$('[type="text/x-handlebars-template"]').each(function(index, div){
  Templates[div.id] = Handlebars.compile(div.innerHTML);
});