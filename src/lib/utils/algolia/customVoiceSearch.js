import { connectVoiceSearch } from 'instantsearch.js/es/connectors';

const renderVoiceSearch = (renderOptions, isFirstRender) => {
    const { voiceListeningState, toggleListening, refine, widgetParams } = renderOptions;

    const {
        status,
        transcript,
        isSpeechFinal,
        errorCode,
    } = voiceListeningState;

    if (isFirstRender) {
        const container = document.querySelector(widgetParams.container);
        container.innerHTML = `<button type="button" class="absolute inset-y-0 end-0 flex items-center pe-3"><span class="fa-regular fa-microphone w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900" aria-hidden="true"></span></button>`;
        container.querySelector('button').addEventListener('click', event => {
            toggleListening();
        });
    }
    // Safely update the search input only when speech is finalized and not currently focused
    const input = document.querySelector('#searchbox input');
    if (isSpeechFinal && transcript && document.activeElement !== input) {
        input.value = transcript;
        refine(transcript);
    }
};

export const customVoiceSearch = connectVoiceSearch(renderVoiceSearch);
