// ===================== script.js =====================
document.addEventListener("DOMContentLoaded", () => {

    /* *************************************************
     * 1. 공유 버튼 (#shareBtn)
     ************************************************* */
    const shareBtn = document.getElementById("shareBtn");

    if (shareBtn) {
        shareBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const shareData = {
                title: "Soonchan Park’s Portfolio",
                text: "Check out my portfolio.",
                url: window.location.href,
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.error(err);
                }
            } else if (navigator.clipboard) {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("페이지 링크를 복사했습니다.");
                } catch {
                    alert("복사에 실패했습니다.");
                }
            }
        });
    }

    /* *************************************************
     * 2. 모바일 메뉴 토글
     ************************************************* */
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");

    if (toggle) {
        toggle.addEventListener("click", () => {
            header.classList.toggle("open");
        });
    }

    /* *************************************************
     * 3. Steps 섹션
     ************************************************* */
    const stepsData = {
        1: {
            count: "01",
            title: "Drag and drop your dataset directly from your device",
            description:
                "Zip up your images and upload the dataset to HUB. We automatically validate your labels and prepare everything for training.",
            list: [
                "Support for detection, segmentation, and classification tasks",
                "Automatic dataset checks and quick statistics",
                "No scripts needed — just upload and go",
            ],
            dropLabel: "Upload dataset",
            dropHint: "Example: virus_detection_dataset.zip",
            icon: "⬆",
            mainText: "Drop your .zip file here",
            subText: "or click to browse",
        },
        2: {
            count: "02",
            title: "Select your configurations — and let the AI do the rest",
            description:
                "Choose the task and mode that matches your problem, then fine-tune image size, epochs, and more with a few clicks.",
            list: [
                "Built-in presets for common computer vision tasks",
                "Recommended defaults for beginners",
                "Advanced options for fine-tuning experts",
            ],
            dropLabel: "Choose configuration",
            dropHint: "Example: YOLO detection · 50 epochs",
            icon: "⚙",
            mainText: "Select a model template",
            subText: "and adjust training options",
        },
        3: {
            count: "03",
            title: "Deploy your model to the real world",
            description:
                "Export your trained YOLO model to popular formats and run it on mobile, edge, or cloud infrastructure.",
            list: [
                "Export to ONNX, TensorFlow, CoreML, and more",
                "Test predictions directly in the browser",
                "Integrate with your product using a simple API",
            ],
            dropLabel: "Deployment targets",
            dropHint: "Example: mobile app · edge device · cloud API",
            icon: "🚀",
            mainText: "Pick how you want to deploy",
            subText: "and generate ready-to-use artifacts",
        },
    };

    const tabButtons = document.querySelectorAll(".steps-tab");
    const countEl = document.querySelector(".steps-count");
    const titleEl = document.querySelector(".steps-title");
    const descEl = document.querySelector(".steps-description");
    const listEl = document.querySelector(".steps-list");
    const dropLabelEl = document.querySelector(".dropzone-label");
    const dropHintEl = document.querySelector(".dropzone-footer");
    const dropIconEl = document.querySelector(".dropzone-icon");
    const dropMainEl = document.querySelector(".dropzone-area p:nth-child(2)");
    const dropSubEl = document.querySelector(".dropzone-area .dropzone-hint");

    function setStep(step) {
        const data = stepsData[step];
        if (!data) return;

        countEl.textContent = data.count;
        titleEl.textContent = data.title;
        descEl.textContent = data.description;

        listEl.innerHTML = "";
        data.list.forEach((txt) => {
            const li = document.createElement("li");
            li.textContent = txt;
            listEl.appendChild(li);
        });

        dropLabelEl.textContent = data.dropLabel;
        dropHintEl.textContent = data.dropHint;
        dropIconEl.textContent = data.icon;

        if (data.mainText.includes(".zip")) {
            dropMainEl.innerHTML = data.mainText.replace(".zip", "<strong>.zip</strong>");
        } else {
            dropMainEl.textContent = data.mainText;
        }

        dropSubEl.textContent = data.subText;
    }

    if (tabButtons.length > 0) {
        tabButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                tabButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                setStep(btn.dataset.step);
            });
        });
        setStep(1);
    }

    /* *************************************************
     * 4. scale-section 스크롤 애니메이션
     ************************************************* */
    const scaleTargets = document.querySelectorAll(".scale-section");

    if (scaleTargets.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio > 0.6) entry.target.classList.add("is-center");
                    else entry.target.classList.remove("is-center");
                });
            },
            { threshold: [0, 0.3, 0.6, 1] }
        );
        scaleTargets.forEach((el) => observer.observe(el));
    }

    /* *************************************************
     * 5. PHOTO 애니메이션
     ************************************************* */
    const photoItems = document.querySelectorAll(".photo-anim");

    if (photoItems.length > 0) {
        const photoObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );
        photoItems.forEach((el) => photoObserver.observe(el));
    }

    /* *************************************************
     * 6. 포트폴리오 상세 모달 + PDF 모달 기능
     ************************************************* */

    const portfolioModal = document.getElementById("portfolioModal");
    const pdfModal = document.getElementById("pdfModal");

    const modalImg = document.getElementById("modalImage");
    const modalTag = document.getElementById("modalTag");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalPurpose = document.getElementById("modalPurpose");
    const modalDuration = document.getElementById("modalDuration");
    const modalMembers = document.getElementById("modalMembers");
    const modalModel = document.getElementById("modalModel");

    const viewButton = document.getElementById("viewPortfolioBtn");
    const pdfViewer = document.getElementById("pdfViewer");
    const pdfTitle = document.getElementById("pdfTitle");
    const pdfCloseBtn = document.getElementById("pdfCloseBtn");

    const cards = document.querySelectorAll(".audience-card");

    let currentPDF = "";

    // 상세 모달 열기
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const img = card.querySelector(".audience-card_img img");
            const tag = card.querySelector("h4");
            const title = card.querySelector("h3");
            const desc = card.querySelector("p");

            modalImg.src = img.src;
            modalTag.textContent = tag.textContent;
            modalTitle.textContent = title.textContent;
            modalDesc.textContent = desc.textContent;

            modalPurpose.textContent = card.dataset.purpose || "";
            modalDuration.textContent = card.dataset.duration || "";
            modalMembers.textContent = card.dataset.members || "";
            modalModel.textContent = card.dataset.model || "";

            currentPDF = card.dataset.pdf || "";

            portfolioModal.classList.add("is-open");
            document.body.style.overflow = "hidden";
        });
    });

    // 상세 모달 닫기
    document.querySelector(".portfolio-modal-close").addEventListener("click", () => {
        portfolioModal.classList.remove("is-open");
        document.body.style.overflow = "";
    });

    portfolioModal.addEventListener("click", (e) => {
        if (e.target === portfolioModal) {
            portfolioModal.classList.remove("is-open");
            document.body.style.overflow = "";
        }
    });

    // PDF 모달 열기
    viewButton.addEventListener("click", () => {
        if (!currentPDF) {
            alert("PDF 파일이 존재하지 않습니다.");
            return;
        }

        pdfViewer.src = currentPDF;
        pdfTitle.textContent = modalTitle.textContent;

        pdfModal.classList.add("is-open");
        portfolioModal.classList.remove("is-open");
    });

    // PDF 모달 닫기
    const closePDF = () => {
        pdfModal.classList.remove("is-open");
        pdfViewer.src = "";
        document.body.style.overflow = "";
    };

    pdfCloseBtn.addEventListener("click", closePDF);

    pdfModal.addEventListener("click", (e) => {
        if (e.target === pdfModal) closePDF();
    });
});
