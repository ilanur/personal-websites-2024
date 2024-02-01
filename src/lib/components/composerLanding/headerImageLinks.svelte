<script>
      import { PUBLIC_EUI_WEB } from '$env/static/public';
    export let item;
    export let title;

    console.log(item);
    console.log(title);
</script>


<div class="grid grid-cols-3 gap-0">
    <div class="relative col-span-2">
        <h1 class="absolute text-white drop-shadow-lg bottom-0 left-0">{title}</h1>
        <img src="{PUBLIC_EUI_WEB}/{item.image.asset.sys.uri}" alt="{item.image.altText}" />
    </div>
    <div class="col-span-1">
        <div>{@html item.markup}</div>
    </div>
</div>