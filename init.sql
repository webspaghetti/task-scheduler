-- 1. Create custom ENUM type
CREATE TYPE public.task_status AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'COMPLETED'
);

-- 2. Create Tables
CREATE TABLE public.action_history (
    id SERIAL PRIMARY KEY,
    "timestamp" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    message TEXT
);

CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE
);

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    enabled BOOLEAN
);

CREATE TABLE public.refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,token VARCHAR(255) UNIQUE NOT NULL,
    expiry_date TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE public.teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE public.tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    team_id INTEGER REFERENCES public.teams(id),
    status public.task_status DEFAULT 'TODO'::public.task_status,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE public.user_roles (
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE public.user_team (
    user_id INTEGER NOT NULL REFERENCES public.users(id),
    team_id INTEGER NOT NULL REFERENCES public.teams(id),
    PRIMARY KEY (user_id, team_id)
);

CREATE TABLE public.user_task (
    user_id INTEGER REFERENCES public.users(id),
    task_id INTEGER REFERENCES public.tasks(id),
    UNIQUE (user_id, task_id)
);

-- 3. Insert Initial Data (Admin User and Roles)
INSERT INTO public.roles (id, name) VALUES
                                        (1, 'ROLE_USER'),
                                        (2, 'ROLE_MANAGER'),
                                        (3, 'ROLE_ADMIN')
    ON CONFLICT (id) DO NOTHING;

-- Insert the admin user (password: admin)
INSERT INTO public.users (id, first_name, last_name, username, password, enabled)
VALUES (1, 'Admin', 'User', 'admin', '$2a$10$mHZ/TCnz6JI1wVbdsBx3vuCOXd37XgVCXQDqK7TdPXk6uI6RL9m6W', true)
    ON CONFLICT (id) DO NOTHING;

-- Assign roles 1, 2, and 3 to the admin user
INSERT INTO public.user_roles (user_id, role_id) VALUES
                                                     (1, 1),
                                                     (1, 2),
                                                     (1, 3)
    ON CONFLICT DO NOTHING;

-- 4. Reset Sequences
SELECT pg_catalog.setval('public.roles_id_seq', 3, true);
SELECT pg_catalog.setval('public.users_id_seq', 1, true);