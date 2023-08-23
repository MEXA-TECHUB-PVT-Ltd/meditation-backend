CREATE TABLE IF NOT EXISTS public.admin (
        id SERIAL NOT NULL,
        email text ,    
        password text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.User (
        id SERIAL NOT NULL,
        username text,
        email text,
        password text,
        gender text,
        level text,
        goals text[],
        age text,
        badge_id integer,
        image   text ,
        status text,
        subscription_status text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));


CREATE TABLE IF NOT EXISTS public.otp (
            id SERIAL,
            email text,
            otp text,
            status text,
            createdAt timestamp NOT NULL,
            updatedAt timestamp ,
            PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.goal (
        id SERIAL NOT NULL,
        name text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.skill (
        id SERIAL NOT NULL,
        skill_name text,
        icon text ,
        discription text,
        benefit text,
        status text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.exercise (
        id SERIAL NOT NULL,
        name text,
        description text ,
        animations text[],
        audio_file text,
        duration text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));



CREATE TABLE IF NOT EXISTS public.rest_time  (
        id SERIAL NOT NULL,
        user_id SERIAL NOT NULL,
        rest_time text ,
        createdAt timestamp ,
        updatedAt timestamp  ,
        PRIMARY KEY (id)) ;




CREATE TABLE IF NOT EXISTS public.relaxation_music (
        id SERIAL NOT NULL,
        music_name text,
        icon text,
        description text,
        skill_id INT[],
        time_duration INT[] ,
        audio_file text,
        payment_status text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));


CREATE TABLE IF NOT EXISTS public.meditation_plan (
        id SERIAL NOT NULL,
        plan_name text,
        user_id integer,
        icon text,
        description text,
        duration text,
        goals_id INT[],
        age_group text ,
        level text,
        skills_id integer[],
        exercises_id integer[],
        animations text[],
        audio_files text[],
        started_at timestamp,
        payment_status text,
        progress_status text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));



CREATE TABLE IF NOT EXISTS public.yoga_plan (
        id SERIAL NOT NULL,
        plan_name text,
        user_id integer,
        icon text,
        description text,	
        duration text,
        goals_id integer[],
        age_group text ,
        level text,
        skills_id integer[],
        exercises_id integer[],
        started_at timestamp,
        payment_status text,
        progress_status text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));



CREATE TABLE IF NOT EXISTS public.history (
        id SERIAL NOT NULL,
        user_id text,
        action_id text,
        action_type text,
        action_table text,
        count text,
        start_date timestamp,
        end_date timestamp,
        status text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));




CREATE TABLE IF NOT EXISTS public.foundation_plan (
        id SERIAL NOT NULL,
        days  TEXT,
        icon text,
        plan_name text,
        description text,
        plan_id INTEGER[],
        goals_id text,
        age_group text ,
        level text,
        plan_type text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

        



CREATE TABLE IF NOT EXISTS public.reminder (
        id SERIAL NOT NULL,
        time text,
        user_id INTEGER,
        status text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.water_tracking (
        id SERIAL NOT NULL,
        user_id integer,
        capacity text ,
        start_at timestamp,
        week_starts  timestamp,
        daily_intake integer,
        weekly_intake  integer,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.check_badge (
        id SERIAL NOT NULL,
        user_id integer,
        badge_id text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));



CREATE TABLE IF NOT EXISTS public.favorites  (
        id SERIAL NOT NULL,
        user_id INTEGER,
        favorites_id INTEGER ,
        fav_type text,
        createdAt timestamp ,
        updatedAt timestamp  ,
        PRIMARY KEY (id));



CREATE TABLE IF NOT EXISTS public.check_streak (
        id SERIAL NOT NULL,
        user_id integer,
        streak_start_date timestamp,
        start_at timestamp,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.manage_meditation_plan (
        id SERIAL NOT NULL,
        user_id integer,
        plan_id integer,
        skills_id_completed integer[],
        skill_id_on_going integer,
        started_at timestamp,
        exercises_id integer[],
        plan_status text ,
        duration text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.manage_foundation_plan (
        id SERIAL NOT NULL,
        days TEXT,
        user_id integer,
        plan_id integer,
        plan_type text,
        plans_id_completed integer[],
        plan_id_on_going integer,
        skills_id_completed integer[],
        skill_id_on_going integer,
        started_at timestamp,
        exercises_id integer[],
        plan_status text ,
        duration text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.manage_yoga_plan (
        id SERIAL NOT NULL,
        user_id integer,
        plan_id integer,
        skills_id_completed integer[],
        skill_id_on_going integer,
        started_at timestamp,
        exercises_id integer[],
        plan_status text ,
        duration text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.badge (
        id SERIAL NOT NULL,
		name text,
        description text ,
        icon text,
		condition text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

