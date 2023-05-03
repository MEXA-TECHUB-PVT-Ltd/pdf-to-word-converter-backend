CREATE TABLE IF NOT EXISTS public.User (
        id SERIAL NOT NULL,
        username text,
        email text ,
        password text ,
        accountType text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));



CREATE TABLE IF NOT EXISTS public.doctopdf (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        fileurl text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id)) ;

CREATE TABLE IF NOT EXISTS public.pdftodoc (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        fileurl text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id)) ;

CREATE TABLE IF NOT EXISTS public.imgtopdf (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        fileurl text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id)) ;

CREATE TABLE IF NOT EXISTS public.privacyPolicys (
        id SERIAL,
        title text NOT NULL,
        content text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.TermsConditions (
        id SERIAL,
        title text NOT NULL,
        content text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));

