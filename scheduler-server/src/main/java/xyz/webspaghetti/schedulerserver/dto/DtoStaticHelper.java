package xyz.webspaghetti.schedulerserver.dto;


import java.util.*;
import java.util.function.Function;

public final class DtoStaticHelper {

    private DtoStaticHelper(){}

    // Generic method for casting Entity Collections to DTO Lists
    public static <D,E> List<D> entityCollectionToDtoList(Collection<E> entityCollection, Function<E,D> mapperFunction) {

        List<D> dtoResponseList = new ArrayList<>();

        for (E entity : entityCollection) {

            dtoResponseList.add(mapperFunction.apply(entity));
        }

        return dtoResponseList;
    }
}
