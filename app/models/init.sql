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
        email   text,
        password text,
        image   text ,
        status text,
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
        goals_id integer[],
        age_group text ,
        level text,
        skills_id integer[],
        exercises_id integer[],
        started_at text,
        payment_status text,
        progress_status text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));
        
CREATE TABLE IF NOT EXISTS public.foundation_plan (
        id SERIAL NOT NULL,
        plan_name text,
        user_id integer,
        icon text,
        description text,
        duration text,
        days  TEXT,
        goals_id INTEGER[],
        age_group text ,
        level text,
        plan_id INTEGER,
        plan_type text,
        started_at timestamp,
        payment_status text,
        progress_status text,
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
        unit text,
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
        PRIMARY KEY (id)) 

