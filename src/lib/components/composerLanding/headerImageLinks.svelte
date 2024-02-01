<script>
    import { PUBLIC_EUI_WEB } from '$env/static/public';
    export let item;
    export let title;

    //console.log(item);
    //console.log(title);
</script>

<h1 class="mb-6">H1 The heading defines six levels</h1>
<h2 class="mb-6">H2 The heading defines six levels of title elements</h2>
<h3 class="mb-6">H3 The heading defines six levels of title elements</h3>
<h4 class="mb-6">H4 The heading defines six levels of title elements</h4>
<h5 class="mb-6">H5 The heading defines six levels of title elements</h5>
<h6 class="mb-6">H6 The heading defines six levels of title elements</h6>
<p class="text-xl">Lead paragraph</p>

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