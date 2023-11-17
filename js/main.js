// ********* BURGER BUTTON **********************************************
const burgerButton = document.querySelector('.header__burger-button');
const header = document.querySelector('.navbar');
burgerButton.addEventListener('click', () => {
    burgerButton.classList.toggle('active');
    header.classList.toggle('active');
})

// ********* THE DATE CONVERTER ******************************************
function formatDate(dateString) {
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
}


//********* BUSINESS PAGE HTML ELEMENT ***********************************
const businessForm = document.getElementById("contents__form");
const businessInput = document.getElementById("contents__input");
const businessList = document.getElementById("contents__list");
const businessTitle = document.querySelector(".business-hero__title");
const LOADER = document.querySelector(".loading");


//*********** API KEY AND URLS *******************************************
let API_KEY = `b39db5f750724223a7502b91300aa532`
let page = 1;
const businessURL = `https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=5&page=${page}&apiKey=`;
const newsURL = `https://newsapi.org/v2/top-headlines?country=us&category=&pageSize=5&page=${page}&apiKey=`
// const newsURLupdate = `https://newsapi.org/v2/top-headlines?country=us&category=&pageSize=5&page=${currentPageNews}&apiKey=`
const createURL = `https://reqres.in/api/users`
const deleteURL = `https://jsonplaceholder.typicode.com/posts/`

// *********** FETCH FUNCTION *********************************************
async function fetchData(url) {
    try {
        LOADER.style.display = 'block'; 
        paginationList.style.display = 'none';
        const response = await fetch(url);
        const data = await response.json();
        paginationList.style.display = 'flex'
        LOADER.style.display = 'none'; 
        // console.log(data);
        if (data.status !== "ok") {
            console.log(`${response.status}`);
        }
        return data.articles;
    } catch (error) {
        console.error(error);
    }
}


// ********** PAGINATION *********************************************
const paginationList = document.getElementById('pagination');
let currentPage = 1;
let totalPages = 1;

function updatePage(newPage) {

    currentPage = newPage;

    const businessURLupdate = `https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=5&page=${currentPage}&apiKey=${API_KEY}`;
    fetchData(businessURLupdate).then((data) => {
        renderFunc(data);
    });
}

function createButton() {
    if (!paginationList) return;
    paginationList.innerHTML = '';

    minPage = Math.max(1, currentPage - 4);
    maxPage = minPage + 8;

    for (let i = minPage; i <= Math.min(maxPage, totalPages); i++) {
        const paginationButtons = document.createElement('button');
        paginationButtons.className = "pagination__btn"
        paginationButtons.textContent = i;
        paginationButtons.style.transition = 'all 0.5s ease';

        if (i === currentPage) {
            paginationButtons.classList.add("active")
        }

        paginationButtons.addEventListener("click", () => {
            updatePage(i);
            window.scrollTo(0, 0);
            minPage = Math.max(1, i - 4);
            maxPage = minPage + 8;
            createButton();
        });

        paginationList.appendChild(paginationButtons);
    }
}

async function fetchTotalPages() {
    try {
        const response = await fetch(businessURL + API_KEY);
        const data = await response.json();
        totalPages = Math.ceil(data.totalResults / 5); 
        createButton();
    } catch (error) {
        console.error(error);
    }
}

fetchTotalPages();

// *********** POST ELEMENT  **************************************************
const elForm = document.querySelector(".register__form");
const firstName = document.querySelector(".register__firstnameInp");
const lastName = document.querySelector(".register__lastnameInp");
const email = document.querySelector(".register__usernameInp");
const elFormBtn = document.querySelector(".register__button");
let regList = document.querySelector('.register__list');

async function createFunc(userData) {
    const response = await fetch(createURL, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            userData
        }),
    });

    try {
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            // console.log(data.userData);
            // console.log(data.id)
            renderPosts(data);
            return data;
        } else {
            console.error(response.status);
        }
    } catch (error) {
        console.error(error);
    }
}


if (elFormBtn) {
    elFormBtn.addEventListener("click", async (evt) => {
        evt.preventDefault();
        const firstNameValue = firstName.value.trim();
        const lastNameValue = lastName.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = document.querySelector(".register__passwordInp").value.trim();
        const confirmPasswordValue = document.querySelector(".register__confimpasswordInp").value.trim();


        const userData = {
            firstName: firstNameValue,
            lastName: lastNameValue,
            email: emailValue,
        };

        if (!firstNameValue || !lastNameValue || !emailValue || !passwordValue || !confirmPasswordValue) {
            alert("Please fill all fields required!");
            return;
        }

        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailValue.match(validRegex)) {
            alert("Please enter valid email!");
            return;
        }

        if (passwordValue !== confirmPasswordValue) {
            alert("Passwords do not match!");
            return;
        } else {
            await createFunc(userData);
            elForm.reset();
        }
    })
}


// ******************  DELETE USER  ***********************************
async function deletFunc(id, deletePost) {
    try {
        const response = await fetch(`${deleteURL}${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            regList.removeChild(deletePost);
        } else {
            console.error(` ${id}.`);
        }
    } catch (error) {
        console.error(error);
    }
}

//  *************** RENDER BUSINESS *****************************************

function renderFunc(datas) {
    if (!businessList) return;
    businessList.innerHTML = ''
    datas.forEach((data) => {
        const {
            urlToImage,
            author,
            title,
            source,
            content,
            url,
            publishedAt
        } = data;

        let fragment = new DocumentFragment();

        const contentCard = document.createElement('li');
        contentCard.className = "contents__card";

        const contentImg = document.createElement('img');
        contentImg.src = urlToImage;
        contentImg.alt = title;
        contentImg.className = 'contents__img';

        const contentBody = document.createElement('div');
        contentBody.className = "contensts__body";

        const contentHeading = document.createElement('div');
        contentHeading.className = "contents__heading";

        const contentName = document.createElement('span');
        contentName.className = "contents__name";
        contentName.textContent = `${source.name}  `;

        const contentAuthor = document.createElement('span');
        contentAuthor.className = "contents__author";
        contentAuthor.textContent = `| By ${author}  | `;

        const contentDate = document.createElement('span');
        contentDate.className = "contents__date";

        const formattedDate = formatDate(publishedAt);
        contentDate.textContent = formattedDate;

        const contentTitle = document.createElement('h2');
        contentTitle.className = "contents__title";
        contentTitle.textContent = title;

        const contentText = document.createElement('p');
        contentText.className = "contents__text";
        contentText.textContent = content;

        const contentToSiteBtn = document.createElement('a');
        contentToSiteBtn.href = url;
        contentToSiteBtn.className = 'contents__towebsitebtn';
        contentToSiteBtn.textContent = "to website read more";
        contentToSiteBtn.setAttribute('target', '_blank');

        contentHeading.appendChild(contentName);
        contentHeading.appendChild(contentAuthor);
        contentHeading.appendChild(contentDate);

        contentBody.appendChild(contentHeading);
        contentBody.appendChild(contentTitle);
        contentText.appendChild(contentToSiteBtn);
        contentBody.appendChild(contentText);

        contentCard.appendChild(contentImg);
        contentCard.appendChild(contentBody);

        fragment.appendChild(contentCard);
        businessList.appendChild(fragment);
    });
}

// *********** BUSINESS SEARCH *********************************************
if (businessForm) {
    businessForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        businessList.innerHTML = '';

        const businessInputValue = businessInput.value.trim().toLowerCase();

        let searchURL = `https://newsapi.org/v2/top-headlines?q=${businessInputValue}&pageSize=5&page=1&apiKey=${API_KEY}`;
        const searchURL2 = `https://newsapi.org/v2/everything?q=${businessInputValue}&from=2023-11-13&to=2023-11-16&sortBy=popularity&pageSize=5&page=${currentPage}&apiKey=${API_KEY}`

        const news = await fetchData(searchURL2);
        if (news.length === 0) {
            businessList.innerHTML = `<h3 class="error-message">not found!</h3>`
            paginationList.innerHTML = ""
        } else {
            businessTitle.textContent = `${businessInputValue}`
            renderFunc(news);

        }

        businessForm.reset();
    });
}


fetchData(`${businessURL}${API_KEY}`).then((data) => renderFunc(data));
createButton();

// ************** RENDER NEWS *****************************************
const newsForm = document.getElementById("contents__formnews");
const newsList = document.getElementById("contents__listnews");

function renderNews(datas) {
    if (!newsList) return;

    datas.forEach((data) => {
        const {
            urlToImage,
            author,
            title,
            source,
            content,
            url,
            publishedAt
        } = data;

        let fragment = new DocumentFragment();

        const contentCard = document.createElement('li');
        contentCard.className = "contents__card";

        const contentImg = document.createElement('img');
        contentImg.src = urlToImage;
        contentImg.alt = title;
        contentImg.className = 'contents__img';

        const contentBody = document.createElement('div');
        contentBody.className = "contensts__body";

        const contentHeading = document.createElement('div');
        contentHeading.className = "contents__heading";

        const contentName = document.createElement('span');
        contentName.className = "contents__name";
        contentName.textContent = `${source.name}  `;

        const contentAuthor = document.createElement('span');
        contentAuthor.className = "contents__author";
        contentAuthor.textContent = `| By ${author}  | `;

        const contentDate = document.createElement('span');
        contentDate.className = "contents__date";

        const formattedDate = formatDate(publishedAt);
        contentDate.textContent = formattedDate;

        const contentTitle = document.createElement('h2');
        contentTitle.className = "contents__title";
        contentTitle.textContent = title;

        const contentText = document.createElement('p');
        contentText.className = "contents__text";
        contentText.textContent = content;

        const contentToSiteBtn = document.createElement('a');
        contentToSiteBtn.href = url;
        contentToSiteBtn.className = 'contents__towebsitebtn';
        contentToSiteBtn.textContent = "to website read more";
        contentToSiteBtn.setAttribute('target', '_blank');

        contentHeading.appendChild(contentName);
        contentHeading.appendChild(contentAuthor);
        contentHeading.appendChild(contentDate);

        contentBody.appendChild(contentHeading);
        contentBody.appendChild(contentTitle);
        contentText.appendChild(contentToSiteBtn);
        contentBody.appendChild(contentText);

        contentCard.appendChild(contentImg);
        contentCard.appendChild(contentBody);

        fragment.appendChild(contentCard);
        newsList.appendChild(fragment);
    });
}



// *********** NEWS SEARCH *********************************************
if (newsForm) {
    newsForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();

        newsList.innerHTML = '';
        const newsInputValue = document.querySelector('.news__input').value.trim().toLowerCase();
        const searchURLforNews = `https://newsapi.org/v2/everything?q=${newsInputValue}&from=2023-11-13&to=2023-11-16&sortBy=popularity&apiKey=${API_KEY}`;

        const news = await fetchData(searchURLforNews);
        if (news.length === 0) {
            newsList.innerHTML = `<h3 class="error-message">not found!</h3>`
            paginationList.innerHTML = ""
        } else {
            // businessTitle.textContent = `${newsInputValue}`
            renderNews(news);
        }

        newsForm.reset();
    });
}

fetchData(`${newsURL}${API_KEY}`).then((data) => renderNews(data));

//***************** RENDER CREATE USERS ****************************************
let userCard;

function renderPosts(data) {
    if (!regList) return;

    let fragment = new DocumentFragment();

    let userCard = document.createElement('li');
    userCard.className = "register__card";

    const userFirstname = document.createElement('p');
    userFirstname.className = "register__firstname";
    userFirstname.textContent = `${data.userData.firstName}`

    const userLastname = document.createElement('p');
    userLastname.className = "register__lastname";
    userLastname.textContent = `${data.userData.lastName}`

    const email = document.createElement('p');
    email.className = "register__email";
    email.textContent = `${data.userData.email}`;

    const deleteButton = document.createElement('button');
    deleteButton.className = "register__deletebtn";

    userCard.appendChild(userFirstname);
    userCard.appendChild(userLastname);
    userCard.appendChild(email);
    userCard.appendChild(deleteButton);

    fragment.appendChild(userCard);
    regList.appendChild(fragment);

    deleteButton.addEventListener('click', () => {
        deletFunc(data.id, userCard)
    })

}