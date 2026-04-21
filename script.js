const SLICE_HEIGHT = 2000;
const SLICE_WIDTH = 900;

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const uploadLabel = document.querySelector('.upload-label');
    const previewSection = document.getElementById('preview');
    const previewImage = document.getElementById('previewImage');
    const imageDimensions = document.getElementById('imageDimensions');
    const resultsSection = document.getElementById('results');
    const splitImagesGrid = document.getElementById('splitImages');
    const loading = document.getElementById('loading');

    // ドラッグ&ドロップ対応
    uploadLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadLabel.classList.add('drag-over');
    });

    uploadLabel.addEventListener('dragleave', () => {
        uploadLabel.classList.remove('drag-over');
    });

    uploadLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadLabel.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    imageInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    uploadLabel.addEventListener('click', () => {
        imageInput.click();
    });

    // ハンドラー関数をスコープ内で定義
    function handleFiles(files) {
        if (files.length === 0) return;

        const file = files[0];
        if (!file.type.startsWith('image/')) {
            alert('画像ファイルを選択してください');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                displayPreview(img);
                splitAndDisplay(img);
            };
            img.onerror = () => {
                alert('画像の読み込みに失敗しました');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function displayPreview(img) {
        previewSection.style.display = 'block';
        previewImage.src = img.src;
        imageDimensions.textContent = `元画像: ${img.naturalWidth}px × ${img.naturalHeight}px`;
    }

    function splitAndDisplay(img) {
        loading.style.display = 'block';
        resultsSection.style.display = 'none';
        splitImagesGrid.innerHTML = '';

        setTimeout(() => {
            const slices = splitImage(img);
            displaySplitImages(slices);
            loading.style.display = 'none';
            resultsSection.style.display = 'block';
        }, 100);
    }

    function splitImage(img) {
        const slices = [];
        const canvas = document.createElement('canvas');
        canvas.width = SLICE_WIDTH;
        canvas.height = SLICE_HEIGHT;
        const ctx = canvas.getContext('2d');

        const totalHeight = img.naturalHeight;
        let sliceIndex = 0;

        for (let y = 0; y < totalHeight; y += SLICE_HEIGHT) {
            const currentHeight = Math.min(SLICE_HEIGHT, totalHeight - y);

            canvas.height = currentHeight;
            ctx.clearRect(0, 0, SLICE_WIDTH, currentHeight);

            ctx.drawImage(
                img,
                0, y,
                SLICE_WIDTH, currentHeight,
                0, 0,
                SLICE_WIDTH, currentHeight
            );

            const imageData = canvas.toDataURL('image/png');
            slices.push({
                data: imageData,
                index: sliceIndex,
                height: currentHeight,
                width: SLICE_WIDTH
            });

            sliceIndex++;
        }

        return slices;
    }

    function displaySplitImages(slices) {
        slices.forEach((slice) => {
            const item = document.createElement('div');
            item.className = 'split-image-item';

            const img = document.createElement('img');
            img.src = slice.data;
            img.alt = `分割画像 ${slice.index + 1}`;

            const info = document.createElement('p');
            info.textContent = `${slice.index + 1}番目 (${slice.width}×${slice.height}px)`;

            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = 'ダウンロード';
            downloadBtn.addEventListener('click', () => {
                downloadImage(slice.data, slice.index + 1);
            });

            item.appendChild(img);
            item.appendChild(info);
            item.appendChild(downloadBtn);
            splitImagesGrid.appendChild(item);
        });
    }

    function downloadImage(imageData, index) {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `split-image-${index}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

function handleFiles(files) {
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            displayPreview(img);
            splitAndDisplay(img);
        };
        img.onerror = () => {
            alert('画像の読み込みに失敗しました');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayPreview(img) {
    previewSection.style.display = 'block';
    previewImage.src = img.src;
    imageDimensions.textContent = `元画像: ${img.naturalWidth}px × ${img.naturalHeight}px`;
}

function splitAndDisplay(img) {
    loading.style.display = 'block';
    resultsSection.style.display = 'none';
    splitImagesGrid.innerHTML = '';

    setTimeout(() => {
        const slices = splitImage(img);
        displaySplitImages(slices);
        loading.style.display = 'none';
        resultsSection.style.display = 'block';
    }, 100);
}

function splitImage(img) {
    const slices = [];
    const canvas = document.createElement('canvas');
    canvas.width = SLICE_WIDTH;
    canvas.height = SLICE_HEIGHT;
    const ctx = canvas.getContext('2d');

    const totalHeight = img.naturalHeight;
    let sliceIndex = 0;

    for (let y = 0; y < totalHeight; y += SLICE_HEIGHT) {
        const currentHeight = Math.min(SLICE_HEIGHT, totalHeight - y);

        // キャンバスを初期化（前のスライスの余った部分をクリア）
        canvas.height = currentHeight;
        ctx.clearRect(0, 0, SLICE_WIDTH, currentHeight);

        // 画像の該当部分を描画
        ctx.drawImage(
            img,
            0, y,
            SLICE_WIDTH, currentHeight,
            0, 0,
            SLICE_WIDTH, currentHeight
        );

        // Base64でエンコード
        const imageData = canvas.toDataURL('image/png');
        slices.push({
            data: imageData,
            index: sliceIndex,
            height: currentHeight,
            width: SLICE_WIDTH
        });

        sliceIndex++;
    }

    return slices;
}

function displaySplitImages(slices) {
    slices.forEach((slice) => {
        const item = document.createElement('div');
        item.className = 'split-image-item';

        const img = document.createElement('img');
        img.src = slice.data;
        img.alt = `分割画像 ${slice.index + 1}`;

        const info = document.createElement('p');
        info.textContent = `${slice.index + 1}番目 (${slice.width}×${slice.height}px)`;

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = 'ダウンロード';
        downloadBtn.addEventListener('click', () => {
            downloadImage(slice.data, slice.index + 1);
        });

        item.appendChild(img);
        item.appendChild(info);
        item.appendChild(downloadBtn);
        splitImagesGrid.appendChild(item);
    });
}

function downloadImage(imageData, index) {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `split-image-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
