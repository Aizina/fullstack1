import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Blog app', () => {

  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3000/api/testing/reset');
    await request.post('http://localhost:3000/api/users', {
      data: {
        name:     'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    });
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  test.describe('Login UI', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click();
      await page.getByPlaceholder('Username').fill('mluukkai');
      await page.getByPlaceholder('Password').fill('salainen');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click();
      await page.getByPlaceholder('Username').fill('mluukkai');
      await page.getByPlaceholder('Password').fill('wrongpassword');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText('Invalid username or password')).toBeVisible();
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible();
    });
  });


  test.describe('When logged in', () => {
    test.beforeEach(async ({ page, request }) => {
      const loginRes = await request.post('http://localhost:3000/api/login', {
        data: { username: 'mluukkai', password: 'salainen' },
      });
      const user = await loginRes.json();

      await page.evaluate(userObj => {
        localStorage.setItem('loggedBlogAppUser', JSON.stringify(userObj));
      }, user);

      await page.reload();
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
    });

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click();
      await page.getByPlaceholder('title').fill('New blog from Playwright');
      await page.getByPlaceholder('author').fill('Playwright Author');
      await page.getByPlaceholder('url').fill('http://playwright.dev');
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(
        page.getByText('a new blog New blog from Playwright by Playwright Author added'),
      ).toBeVisible();
      await expect(
        page.locator('.blog', { hasText: 'New blog from Playwright Playwright Author' }),
      ).toBeVisible();
    });

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click();
      await page.getByPlaceholder('title').fill('Blog to be liked');
      await page.getByPlaceholder('author').fill('Liker');
      await page.getByPlaceholder('url').fill('http://like.com');
      await page.getByRole('button', { name: 'Create' }).click();
      await expect(page.locator('.blog', { hasText: 'Blog to be liked Liker' })).toBeVisible();

      const blog = page.locator('.blog', { hasText: 'Blog to be liked Liker' });
      await blog.getByRole('button', { name: 'view' }).click();

      await expect(blog.getByText('Likes: 0')).toBeVisible();
      await blog.getByRole('button', { name: 'like' }).click();
      await expect(blog.getByText('Likes: 1')).toBeVisible();
    });

    test('the user who created a blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click();
      await page.getByPlaceholder('title').fill('Blog to be deleted');
      await page.getByPlaceholder('author').fill('Deleter');
      await page.getByPlaceholder('url').fill('http://delete.com');
      await page.getByRole('button', { name: 'Create' }).click();
      await expect(page.locator('.blog', { hasText: 'Blog to be deleted Deleter' })).toBeVisible();

      const blog = page.locator('.blog', { hasText: 'Blog to be deleted Deleter' });
      await blog.getByRole('button', { name: 'view' }).click();

      page.on('dialog', dialog => dialog.accept());

      await blog.getByRole('button', { name: 'remove' }).click();

      await expect(page.getByText('Blog deleted successfully.')).toBeVisible();
      await expect(page.locator('.blog', { hasText: 'Blog to be deleted Deleter' })).not.toBeVisible();
    });

    test('blogs are ordered by likes, most likes first', async ({ page }) => {
      const createBlog = async (title: string, author: string, url: string) => {
        await page.getByRole('button', { name: 'new blog' }).click();
        await page.getByPlaceholder('title').fill(title);
        await page.getByPlaceholder('author').fill(author);
        await page.getByPlaceholder('url').fill(url);
        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.locator('.blog', { hasText: title })).toBeVisible();
      };
      await createBlog('Least likes',  'Author A', 'http://a.com');
      await createBlog('Medium likes', 'Author B', 'http://b.com');
      await createBlog('Most likes',   'Author C', 'http://c.com');

      const likeBlogNTimes = async (title: string, n: number) => {
        const blog = page.locator('.blog', { hasText: title });
        await blog.getByRole('button', { name: 'view' }).click();
        for (let i = 1; i <= n; i++) {
          await blog.getByRole('button', { name: 'like' }).click();
          await expect(blog.getByText(`Likes: ${i}`)).toBeVisible();
        }
      };

      await likeBlogNTimes('Most likes',   3);
      await likeBlogNTimes('Medium likes', 1);

      const blogs = page.locator('.blog');
      await expect(blogs.nth(0)).toContainText('Most likes');
      await expect(blogs.nth(1)).toContainText('Medium likes');
      await expect(blogs.nth(2)).toContainText('Least likes');
    });
  });

  test.describe('User permissions', () => {
    test.beforeEach(async ({ request }) => {
      await request.post('http://localhost:3000/api/users', {
        data: {
          name:     'Ada Lovelace',
          username: 'adalove',
          password: 'math123',
        },
      });
    });

    test('only the creator can see the delete button', async ({ page, request }) => {
      const loginRes = await request.post('http://localhost:3000/api/login', {
        data: { username: 'mluukkai', password: 'salainen' },
      });
      const mluukkaiUser = await loginRes.json();

      await page.evaluate(u => localStorage.setItem('loggedBlogAppUser', JSON.stringify(u)), mluukkaiUser);
      await page.reload();
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();

      await page.getByRole('button', { name: 'new blog' }).click();
      await page.getByPlaceholder('title').fill('Private Blog');
      await page.getByPlaceholder('author').fill('Secret Author');
      await page.getByPlaceholder('url').fill('http://private.com');
      await page.getByRole('button', { name: 'Create' }).click();
      await expect(page.locator('.blog', { hasText: 'Private Blog Secret Author' })).toBeVisible();

      await page.getByRole('button', { name: 'Logout' }).click();
      await expect(page.getByText('log in to application')).toBeVisible();

      await page.getByRole('button', { name: 'login' }).click();
      await page.getByPlaceholder('Username').fill('adalove');
      await page.getByPlaceholder('Password').fill('math123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText('Ada Lovelace logged in')).toBeVisible();

      const blog = page.locator('.blog', { hasText: 'Private Blog Secret Author' });
      await blog.getByRole('button', { name: 'view' }).click();

      await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible();
    });
  });
});