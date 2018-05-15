# raytracing.js

Pesquisar: https://threejs.org/editor/
Pesquisar: Big and Ugly Rendering Project
Buscar: rendering farm javascript
Exemplo: smallpt, http://renderer.ivank.net/, http://www.kevinbeason.com/smallpt/

Ideias:
Desenvolver requestAnimationFrame() para o usuário poder ver o progresso da renderização enquanto aguarda;
Mover função trace para dentro de cada objeto, assim cada um se responsabiliza sobre como deve ser renderizado;
Definir cor de cada objeto;
Definir taxa_de_emissão de cada objeto;
	A cor emitida será igual a sua própria cor;
	A particularidade de "luz negra" será considerada depois;
Definir reflexão;
Definir refração;
❓ Definir cor ambiente a partir da média da distância entre objetos e suas emissões de luz
❓ Definir "especularidade"?