<script>
    import { PUBLIC_EUI_WEB } from '$env/static/public';
    export let item;
    export let title;

    //console.log(item);
    //console.log(title);
</script>

<!-- h1 with your specified sizes, adjusting for the excessive size at 6xl -->
<h1 class="text-4xl md:text-5xl lg:text-6xl">Heading 1</h1>

<!-- h2, one size down from h1 as per your instructions -->
<h2 class="text-3xl md:text-4xl lg:text-5xl">Heading 2</h2>

<!-- Continuing the pattern, decrementing the sizes for each subsequent heading -->
<h3 class="text-2xl md:text-3xl lg:text-4xl">Heading 3</h3>

<h4 class="text-xl md:text-2xl lg:text-3xl">Heading 4</h4>

<!-- Assuming the pattern continues, adjusting for smaller headings -->
<h5 class="text-lg md:text-xl lg:text-2xl">Heading 5</h5>

<!-- For h6, you might start with base text size and increase moderately -->
<h6 class="text-md md:text-lg lg:text-xl">Heading 6</h6>

<p class="text-xl">Lead paragraph</p>
<p class="">Paragraph</p>

<div class="grid grid-cols-1 2xl:grid-cols-3 gap-0">
    <div class="relative col-span-2">
        <h1 class="absolute text-white drop-shadow-lg bottom-0 left-0">{title}</h1>
        <figure>
            <img src="{PUBLIC_EUI_WEB}/{item.image.asset.sys.uri}" alt="{item.image.altText}" />
            <figcaption class="sr-only">{item.image.altText}</figcaption>
        </figure>
    </div>
    <div class="col-span-1">
        <div>{@html item.markup}</div>
    </div>
</div>