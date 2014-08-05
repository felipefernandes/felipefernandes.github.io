---
layout: post
title:  "CSS Efeito Marcatexto"
date:   2014-08-05 10:13:42
categories: css frontend development
---

Um efeitozinho bacana que volta e meia aparece nos layouts dos designers com quem trabalho é esse efeito de marcatexto, e é bem útil em alguns casos. E para quem tá querendo saber como faz, eu achei um método bem simples usando o HTML e CSS 3, se liga só:

**No HTML vai ficar assim...**
{% highlight html %}
<p class="marcatexto">
	<span>Lorem ipsum dolor sit<br>amet omtip gullan</span>
<p>
{% endhighlight %}

**E o CSS, assim...**
{% highlight css %}
.marcatexto {
	box-shadow: 15px 0 0 0 #000, -5px 0 0 0 #000;
	background: #000;
	display: inline;
	padding: 3px 0 !important;
	position: relative;
}
{% endhighlight %}

Bom, se você quiser trocar a cor do seu marcatexto é só mudar o **#000** pelo código Hexadecimal da cor de sua preferência.

Molezinha, né? E aí curtiu?