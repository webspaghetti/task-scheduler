package xyz.webspaghetti.schedulerserver.annotation;

import xyz.webspaghetti.schedulerserver.enums.ActionType;
import xyz.webspaghetti.schedulerserver.enums.EntityType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TrackActionHistory {

    ActionType actionType();
    EntityType entityType();
    boolean payload();
}
